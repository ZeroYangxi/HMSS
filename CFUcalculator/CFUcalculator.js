document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("cfuForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting in the traditional way

      // Get values from the form
      const colonies = document.getElementById("colonies").value;
      const size = document.getElementById("size").value;
      const exposureTime = document.getElementById("exposureTime").value;

      // Calculate CFU
      const cfu = CFUCounter(
        parseInt(colonies),
        parseFloat(size),
        parseFloat(exposureTime)
      );

      // Display the result
      document.getElementById("result").textContent = `Calculated CFU: ${cfu}`;
    });
});

function CFUCounter(colonies, size, exposureTime) {
  // Ensure values are not zero to prevent division by zero
  if (size == 0 || exposureTime == 0) {
    alert("Size and exposure time must be greater than 0.");
    return;
  }

  let CFU = Math.floor(
    5 * colonies * Math.pow(10, 4) * Math.pow(size * exposureTime, -1)
  );
  return CFU;
}
