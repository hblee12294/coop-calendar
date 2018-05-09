// Login and Signup services

export const userLogin = async (url, userInfo) => {
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

export const userSignup = async (url, userInfo) => {
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

export const userLogout = async (url) => {
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

export const getUserEvents = async (url) => {
    try {
        const res = await fetch(url, {
            method : 'GET',
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

export const createEvent = async (url, event) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
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

export const editEvent = async (url, event) => {
    try {
        let res = await fetch(url, {
            method: 'PUT',
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

export const deleteEvent = async (url, event) => {
    try {
        let res = await fetch(url, {
            method: 'DELETE',
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