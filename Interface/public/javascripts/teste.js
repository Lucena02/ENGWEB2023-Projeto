function myFunction(length, j) {
    var paragraphs = document.querySelectorAll("#myDIV");
    console.log(j);
    for (; length > 0; j++, length--) {
      var x = paragraphs[j];
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
  }


let slideIndex = 1;

// Next/previous controls
function plusSlides(n, max, c) {
  showSlides(slideIndex += n, max, c);
}

// Thumbnail image controls
function currentSlide(n, max, c) {
  showSlides(slideIndex = n, max, c);
}

function showSlides(n, max, c) {
  let y = c;
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > max) {slideIndex = 1}
  if (n < 1) {slideIndex = max}
  for (i = 0; i < max; y++, i++) {
    slides[y].style.display = "none";
  }
  for (i = 0; i < max; c++, i++) {
    dots[c].className = dots[c].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}