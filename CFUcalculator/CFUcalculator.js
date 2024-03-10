document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('cfuForm');
  const photoInput = document.getElementById('photo');
  const imagePreview = document.getElementById('imagePreview');
  const resultDisplay = document.getElementById('result');

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the form from submitting in the traditional way
      
      // ... Your existing code to get form values and calculate CFU ...

      // Display the result
      resultDisplay.textContent = `Calculated CFU: ${cfu}`;
  });

  // Listener for changes on the photo input
  photoInput.addEventListener('change', function () {
      const file = photoInput.files[0];
      if (file) {
          // Use FileReader to read the file contents
          const reader = new FileReader();
          reader.onload = function (e) {
              // Set the background image of the imagePreview element to the uploaded file
              imagePreview.style.backgroundImage = `url(${e.target.result})`;
              imagePreview.style.backgroundSize = 'contain';
              imagePreview.style.backgroundRepeat = 'no-repeat';
              imagePreview.style.backgroundPosition = 'center center';
          };
          reader.readAsDataURL(file);
      }
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
