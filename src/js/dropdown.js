var dropdownButtonExpanded = false

window.addEventListener("click", function(event) {
  var dropdownButton = event.target.closest(".dropdown-button")
  if (dropdownButton) {
    dropdownButtonExpanded = dropdownButton.querySelector(".dropdown").classList.toggle("expand")
  }
  else {
    document.querySelectorAll(".dropdown").forEach(dropdown => dropdown.classList.remove("expand"))
    if (dropdownButtonExpanded) {
      event.preventDefault()
    }
    dropdownButtonExpanded = false
  }
})
