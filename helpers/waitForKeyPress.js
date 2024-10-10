const readline = require('readline');

function waitForKeyPress() {
    console.log("waiting for key press")
    return new Promise((resolve) => {
        process.stdin.setRawMode(true);  // Set raw mode to capture keypress
        process.stdin.resume();  // Start listening for keypress
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            process.stdin.pause();  // Stop listening after a key is pressed
            resolve();
        });
    });
}

module.exports = waitForKeyPress