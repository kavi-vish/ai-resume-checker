export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    loadPromise = Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker?url"),
    ])
        .then(([lib, worker]) => {
            // ✅ Correct worker setup (Vite-compatible)
            lib.GlobalWorkerOptions.workerSrc = worker.default;
            pdfjsLib = lib;
            return lib;
        })
        .catch((err) => {
            console.error("PDF.js load error:", err);
            throw err;
        });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await lib.getDocument({
            data: arrayBuffer,
        }).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 }); // reduced scale for performance

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return {
                imageUrl: "",
                file: null,
                error: "Canvas context not available",
            };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                        return;
                    }

                    const fileName = file.name.replace(/\.pdf$/i, "");
                    const imageFile = new File([blob], `${fileName}.png`, {
                        type: "image/png",
                    });

                    resolve({
                        imageUrl: URL.createObjectURL(blob),
                        file: imageFile,
                    });
                },
                "image/png",
                1.0
            );
        });
    } catch (err: any) {
        console.error("PDF conversion error:", err);

        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err?.message || err}`,
        };
    }
}