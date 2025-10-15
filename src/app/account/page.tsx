"use client"

const Account = () => {
    const handleLogout = async () => {
        try{
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                }
            })
            window.location.href = "/";
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div>
            <h1>Account Page</h1>
            <button className="mt-100 ml-200 border" onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default Account
