var sidenav = document.querySelector(".side-navbar")
sedemav.style.display = "none"

function shownavbar()
{
    sidenav.style.left="0"
}

function closenavbar()
{
    sidenav.style.left="-60%"
}


  function toggleNote(element) {
    const notesContainer = element.closest('.notes-header')?.nextElementSibling || element.closest('.notes');
    notesContainer.classList.toggle('active');
  }
