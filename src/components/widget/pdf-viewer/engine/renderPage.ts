export async function renderPage(
  page: any,
  canvas: HTMLCanvasElement,
  scale = 1,
) {
  const viewport = page.getViewport({ scale });

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas context null");

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = viewport.width + "px";
  canvas.style.height = viewport.height + "px";
  canvas.style.background = "#fff";

  console.debug("[PDF] rendering", viewport.width, viewport.height);

  const renderTask = page.render({
    canvasContext: context,
    viewport,
  });

  await renderTask.promise;

  console.debug("[PDF] render done");
}
