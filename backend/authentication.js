document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Simple hardcoded username/password validation
    if (username === "admin" && password === "password123") {
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to another page
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
});
