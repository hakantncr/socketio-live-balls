app.controller("indexController", ['$scope', 'indexFactory', ($scope, indexFactory) => {

$scope.messages = [ ];
$scope.players = { };

$scope.init = () => {
    const username = prompt('Enter username');
    if (username)
        initSocket(username);
    else
        return false;
};

function initSocket(username) {
    const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
    };
// SERVER CONNECTİON
indexFactory.connectSocket('http://localhost:3000', connectionOptions)
    .then((socket) => {
        socket.emit('newUser', { username });

// PLAYERS
socket.on('initPlayers', (players) => {
    $scope.players = players;
    $scope.$apply();
});
// CONNECT
socket.on('newUser', (data) => {
    const messageData = {
        type: {
            code: 0,
            message: 1 // login messages
        }, // info
        username: data.username
    };

$scope.messages.push(messageData);
$scope.$apply();
});
// DISCONNECT
socket.on('disUser', (data) => {
    const messageData = {
        type: {
            code: 0,
            message: 0 // 0 disconnect message
        },
        username: data.username
    }; // info
    $scope.messages.push(messageData);
    $scope.$apply();
});
    }).catch((err) => {
        console.log(err);
    });
}
}]);