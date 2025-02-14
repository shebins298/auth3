document.addEventListener("DOMContentLoaded", () => {
    if (!firebase) {
        console.error("❌ Firebase SDK not loaded!");
        return;
    }

    const body = document.body;

    // Show spinner while loading
    body.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <h2>Loading...</h2>
        </div>
    `;

    auth.onAuthStateChanged(user => {
        if (user) {
            const uid = user.uid;
            db.collection("users").doc(uid).get().then(doc => {
                if (doc.exists) {
                    const role = doc.data().role;

                    // Replace UI with the actual control panel
                    body.innerHTML = `
                        <h1>Welcome to the Control Panel</h1>
                        <button id="user-panel-btn" style="display: none;">User Panel</button>
                        <button id="admin-panel-btn" style="display: none;">Admin Panel</button>
                        <button id="logout">Logout</button>
                    `;

                    // Get new button elements after replacing innerHTML
                    const userPanelBtn = document.getElementById("user-panel-btn");
                    const adminPanelBtn = document.getElementById("admin-panel-btn");
                    const logoutBtn = document.getElementById("logout");

                    userPanelBtn.style.display = "block";
                    if (role === "admin") {
                        adminPanelBtn.style.display = "block";
                    }

                    // Logout event
                    logoutBtn.addEventListener("click", () => {
                        auth.signOut().then(() => {
                            window.location.href = "index.html";
                        });
                    });

                } else {
                    alert("Unauthorized Access!");
                    auth.signOut();
                    window.location.href = "index.html";
                }
            }).catch(error => {
                console.error("❌ Firestore Error:", error);
            });
        } else {
            window.location.href = "index.html";
        }
    });
});
