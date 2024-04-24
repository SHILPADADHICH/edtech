function toggleSideMenu() {
  var sideMenu = document.getElementById('side-menu');
  if (sideMenu.style.left === "-250px") {
    sideMenu.style.left = "0";
  } else {
    sideMenu.style.left = "-250px";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let Name = document.querySelector('.p_name'); 
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      if(data==null)
      window.location.href = "/login";
      Name.innerText = data.username.toUpperCase();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});


const logout = document.querySelector('.logout');
logout.addEventListener('click',()=>{
  const confirmed = confirm("Do you want to logout?");
  if (confirmed) {
      alert("Logout Successfully!");
      window.history.replaceState({}, document.title, '/login');
      window.location.href = "/login";
  }
});