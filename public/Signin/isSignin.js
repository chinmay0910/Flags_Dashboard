document.addEventListener("DOMContentLoaded", async function () {
  // Function to check if the user is signed in
  const checkIfUserIsSignedIn = async () => {
      try {
          const response = await fetch('/getuser', {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Auth-token": localStorage.getItem('Hactify-Auth-token')
              },
          });

          if (!response.ok) {
              throw new Error('Unauthorized');
          }

          const json = await response.json();
          return json;
      } catch (error) {
          console.error('Error:', error);
          return false; // Return false in case of error
      }
  }

  // Call the function to check if the user is signed in
  const user = await checkIfUserIsSignedIn();
  if (!user) {
      // Redirect to login page if user is not signed in
      window.location.href = "/signin";
  } else {
      // Check if user's role is admin
      if (user.role === 'admin') {
          // Show the upload button
          document.getElementById('uploadOptionforaddingFlags').classList.remove('hidden');
          document.getElementById('uploadForm').classList.remove('hidden');
      } else {
          // Hide the upload button
          document.getElementById('uploadOptionforaddingFlags').classList.add('hidden');
          document.getElementById('uploadForm').classList.add('hidden');
      }
  }
});

  
  // Function to logout
  const logout = () => {
    localStorage.clear('Hactify-Auth-token')
    window.location.href = "/"
  }
  