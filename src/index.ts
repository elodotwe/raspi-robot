// import {DigitalChannelMode} from "wpilib-ws-robot";

import {DigitalChannelMode, RobotAccelerometer, RobotGyro, SimDevice} from "@wpilib/wpilib-ws-robot";
import {PCA9685_PWM, I2CBus} from "./PCA9685_PWM"

var ws_robot = require("@wpilib/wpilib-ws-robot")

class RaspiI2c implements I2CBus {
	i2cWrite(register: number, data: number): void {
		console.log("i2c write in raspii2c: " + register + ": " + data)
	}
}

var i2c = new RaspiI2c()

var pwm = new PCA9685_PWM(i2c)
pwm.initialize()


class RaspiRobot extends ws_robot.WPILibWSRobotBase {

    readyP(): Promise<void> {
        return Promise.resolve(undefined);
    }

    get descriptor(): string {
        return "";
    }

    getBatteryPercentage(): number {
        return 1;
    }

    getSimDevice(deviceName: string, deviceIndex: number | null, deviceChannel: number | null): SimDevice {
        return super.getSimDevice(deviceName, deviceIndex, deviceChannel);
    }

    getAllSimDevices(): SimDevice[] {
        return super.getAllSimDevices();
    }

    getAccelerometer(deviceName: string, deviceChannel: number | null): RobotAccelerometer {
        return super.getAccelerometer(deviceName, deviceChannel);
    }

    getAllAccelerometers(): RobotAccelerometer[] {
        return super.getAllAccelerometers();
    }

    getGyro(deviceName: string, deviceIndex: number | null): RobotGyro {
        return super.getGyro(deviceName, deviceIndex);
    }

    getAllGyros(): RobotGyro[] {
        return super.getAllGyros();
    }

    setDigitalChannelMode(channel: number, mode: DigitalChannelMode) {
    }

    setDIOValue(channel: number, value: boolean) {
    }

    getDIOValue(channel: number): boolean {
        return false;
    }

    setAnalogOutVoltage(channel: number, voltage: number) {
    }

    getAnalogInVoltage(channel: number): number {
        return 0;
    }

    setPWMValue(channel: number, value: number) {
        console.log("channel " + channel + ", value " + value)
	let normalized = (value - 127.5) / 127.5
	pwm.setPWM(channel, normalized)
    }

    registerEncoder(encoderChannel: number, chA: number, chB: number) {
        super.registerEncoder(encoderChannel, chA, chB);
    }

    getEncoderCount(channel: number): number {
        return 0;
    }

    getEncoderPeriod(channel: number): number {
        return 0;
    }

    resetEncoder(channel: number) {
    }

    setEncoderReverseDirection(channel: number, reverse: boolean) {
    }

    onWSConnection(remoteAddrV4?: string) {
        super.onWSConnection(remoteAddrV4);
    }

    onWSDisconnection() {
        super.onWSDisconnection();
    }

    onRobotDisabled() {
        super.onRobotDisabled();
	pwm.disable()
	console.log("onRobotDisabled")
    }

    onRobotEnabled() {
        super.onRobotEnabled();
	pwm.enable()
	console.log("onRobotEnabled")
    }

    onDSPacketTimeoutOccurred() {
        super.onDSPacketTimeoutOccurred();
    }

    onDSPacketTimeoutCleared() {
        super.onDSPacketTimeoutCleared();
    }
}

var robot = new RaspiRobot()

const endpointServer = ws_robot.WPILibWSRobotEndpoint.createServerEndpoint(robot);


endpointServer.startP()
    .then(() => {
        console.log("ready i guess?")
    })
