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
        <div className="container text-primary-text mx-auto px-4 mt-40">
            <button className="p-10 rounded-2xl  border" onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default Account
