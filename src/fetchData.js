
export const getUserEvents = async (url) => {
    try{
        let res = await fetch(url,{
            method : 'GET',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            mode: 'cors'});
        return await res.json();
    }catch(e){
        return Promise.reject('get-user-events-fail');
    }
};

export const createEvent = async (url,id,event) => {
    try {
        let res = await fetch(url, {
            method: 'POST',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            body: JSON.stringify({
                id,
                event
            })
        });
        return await res.json();
    }catch (e){
        return Promise.reject('create-event-fail');
    }
};

export const editEvent = async (url,event) => {
    try {
        let res = await fetch(url, {
            method: 'PUT',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            body: JSON.stringify({
                event,
            })
        });
        return await res.json();
    }catch (e){
        return Promise.reject('edit-event-fail');
    }
};

export const deleteEvent = async (url,event) => {
    try {
        let res = await fetch(url, {
            method: 'DELETE',
            Origin: 'http://localhost:5000',
            headers:{'Accept': 'application/json'},
            body: JSON.stringify({
                event,
            })
        });
        return await res.json();
    }catch (e){
        return Promise.reject('delete-event-fail');
    }
};

