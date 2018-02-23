var five = require("johnny-five");
var amqp = require('amqplib/callback_api');

var board = new five.Board({
	port: "COM5"
});

board.on("ready", function() {

	var lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
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
				//lcd.cursor(1, 0);
				lcd.clear().print(msg.content.toString());
			}, {noAck: true});
		});
	});

});