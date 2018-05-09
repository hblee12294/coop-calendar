
const baseUrl = 'http://localhost:5000/';
// Login and Signup services

export const userLogin = async (path, userInfo) => {
    const url = baseUrl + path;

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(userInfo),
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('login-fail (' + e + ')');
    }
}

export const userSignup = async (path, userInfo) => {
    const url = baseUrl + path;

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(userInfo),
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('signup-fail (' + e + ')');
    }
}

export const userLogout = async (path) => {
    const url = baseUrl + path;

    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('logout-fail (' + e + ')');
    }
}


// Data fetch services

export const getUserEvents = async (path) => {
    const url = baseUrl + path;

    try {
        const res = await fetch(url, {
            method : 'GET',
            Origin: 'http://localhost:5000',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('get-user-events-fail (' + e + ')');
    }
};

export const createEvent = async (path, event) => {
    const url = baseUrl + path;

    try {
        const res = await fetch(url, {
            method: 'POST',
            Origin: 'http://localhost:5000',
            headers: { 'Accept': 'application/json' },
            body: JSON.stringify({
                event,
            }),
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('create-event-fail (' + e + ')');
    }
};

export const editEvent = async (path, event) => {
    const url = baseUrl + path;

    try {
        let res = await fetch(url, {
            method: 'PUT',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            body: JSON.stringify({
                event,
            }),
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('edit-event-fail (' + e + ')');
    }
};

export const deleteEvent = async (path, event) => {
    const url = baseUrl + path;
    
    try {
        let res = await fetch(url, {
            method: 'DELETE',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            body: JSON.stringify({
                event,
            }),
            credentials:'include',
        });

        return await res.json();
    }
    catch(e) {
        return Promise.reject('delete-event-fail (' + e + ')');
    }
};