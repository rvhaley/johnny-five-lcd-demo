var five = require("johnny-five");
var amqp = require('amqplib/callback_api');

var board = new five.Board({
	port: "COM5"
});

board.on("ready", function() {

	var lcd = new five.LCD({
    	pins: [7, 8, 9, 10, 11, 12],
    	rows: 4,
    	cols: 20
    });

    lcd.clear().print("Hello world");

	amqp.connect(process.env.CLOUDAMQP_CONNECTION, function(err, conn) {
		if (err) console.error(err);
		conn.createChannel(function(err, ch) {
			ch.assertQueue("jenkins-ci", {exclusive: true, autoDelete: true});
			ch.consume("jenkins-ci", function(msg) {
				console.log(msg.content.toString());
				lcd.clear().print(msg.content.toString());
			}, {noAck: true});
		});
	});

});