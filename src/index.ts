// import {DigitalChannelMode} from "wpilib-ws-robot";

import {DigitalChannelMode, RobotAccelerometer, RobotGyro, SimDevice} from "@wpilib/wpilib-ws-robot";

var ws_robot = require("@wpilib/wpilib-ws-robot")

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
    }

    onRobotEnabled() {
        super.onRobotEnabled();
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
