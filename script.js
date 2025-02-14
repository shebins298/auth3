document.getElementById("google-login").addEventListener("click", () => {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.style.display = "block"; // Show "Authenticating..." message

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log("✅ Login Successful", result.user);
        window.location.href = "control-panel.html"; // Redirect to control panel
    }).catch((error) => {
        console.error("❌ Login Error:", error);
        loadingMessage.style.display = "none"; // Hide message if login fails
    });
});


    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            const uid = user.uid;
            const userEmail = user.email;

            console.log("User logged in:", userEmail);

            // Check if user exists in Firestore
            db.collection("users").doc(uid).get().then(doc => {
                if (!doc.exists) {
                    // First-time login: Assign "pending" role
                    db.collection("users").doc(uid).set({
                        email: userEmail,
                        role: "pending"
                    }).then(() => {
                        alert("Access Denied! Contact Admin to get a role.");
                        auth.signOut();
                        window.location.href = "index.html";
                    });
                } else {
                    // Redirect to control panel if role exists
                    window.location.href = "control-panel.html";
                }
            });
        })
        .catch(error => {
            console.error("Login Error:", error);
        });
});
