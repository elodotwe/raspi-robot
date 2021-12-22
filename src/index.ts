// import {DigitalChannelMode} from "wpilib-ws-robot";

var ws_robot = require("wpilib-ws-robot")

class RaspiRobot extends ws_robot.WPILibWSRobotBase {


    setPWMValue(channel: number, value: number) {
        console.log("setPWMValue " + channel + ", " + value)
    }

    getBatteryPercentage() {
        return 98
    }

    setAnalogOutVoltage(channel: number, voltage: number) {
        console.log("setAnalogOutvoltage called")
    }


    getDIOValue(channel: number): boolean {
        return false;
    }

    getAnalogInVoltage(channel: number): number {
        return 0;
    }

    getEncoderCount(channel: number): number {
        return 0;
    }
}

var robot = new RaspiRobot()

const endpointServer = ws_robot.WPILibWSRobotEndpoint.createServerEndpoint(robot);


endpointServer.startP()
    .then(() => {
        console.log("ready i guess?")
    })
