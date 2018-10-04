function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({
            scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly"
        })
        .then(function () {
                console.log("Sign-in successful");
                $('#signout').prop("disabled", false);
                $('#signin').prop("disabled", true);
                $('#events').empty();
            },
            function (err) {
                console.error("Error signing in", err);
            });
}

function loadClient() {
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
        .then(function () {
                console.log("GAPI client loaded for API");
            },
            function (err) {
                console.error("Error loading GAPI client for API", err);
            });
}

function execute() {
    return gapi.client.calendar.events.list({
            "calendarId": "primary"
        })
        .then(function (response) {
                console.log(response)
                var body = JSON.parse(response.body)
                var summary = []
                var mail = body.summary
                for (var i = 0; i < body.items.length; i++) {
                    summary.push(body.items[i].summary)
                }
                $('#events').empty()
                summary.forEach(addEvent);

                function addEvent(element, index, arr) {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'list-group-item');
                    li.innerHTML = li.innerHTML + element;
                    document.getElementById('events').appendChild(li);
                }
                summary.push(mail)
                $.post('/events', {
                    events: summary
                })
            },
            function (err) {
                console.error("Execute error", err);
            });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({
        client_id: '88623151180-8ud9q0iiim3268p4uf66705re7hrshjd.apps.googleusercontent.com'
    });
});

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        $('#signout').prop("disabled", true);
        $('#signin').prop("disabled", false);
        $('#events').empty();
    });
}