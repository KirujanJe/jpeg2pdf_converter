const { jsPDF } = window.jspdf;

function convertToPDF() {
  const files = document.getElementById("imageInput").files;
  const pageSize = document.getElementById("pageSize").value;
  

  if (files.length === 0) {
    alert("Please select at least one JPEG image.");
    return;
  }

  let pdf;

  // Initialize PDF based on page size
  if (pageSize === "a4") {
    pdf = new jsPDF("p", "mm", "a4");
  } else if (pageSize === "letter") {
    pdf = new jsPDF("p", "mm", "letter");
  } else {
    pdf = new jsPDF(); // temporary, resized per image
  }

  let index = 0;

  function addImageToPDF() {
    const file = files[index];
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {

        // Resize the image using canvas
        const maxWidth = 1800;
        const scale = Math.min(1, maxWidth/img.width);
         const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.75);

        if (pageSize === "fit") {
            pdf.deletePage(1);
            pdf.addPage([canvas.width, canvas.height]);
            pdf.addImage(compressedImage, "JPEG", 0, 0, canvas.width, canvas.height);
            } else {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const ratio = Math.min(
            pageWidth / canvas.width,
            pageHeight / canvas.height
            );

            const imgWidth = canvas.width * ratio;
            const imgHeight = canvas.height * ratio;

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            if (index > 0) pdf.addPage();
            pdf.addImage(compressedImage, "JPEG", x, y, imgWidth, imgHeight);
            }
        index++;
        if (index < files.length) {
          addImageToPDF();
        } else {
          pdf.save("images.pdf");
        }
      };
    };

    reader.readAsDataURL(file);
  }

  addImageToPDF();
}
