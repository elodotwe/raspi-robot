const LED_ON_L_OFFSET = 0
const LED_ON_H_OFFSET = 1
const LED_OFF_L_OFFSET = 2
const LED_OFF_H_OFFSET = 3

const ALL_LED_BASE = 0xfa

function LED_BASE(channel: number): number {
    return 6 + channel * 4
}

let channelCount = 16

export class PCA9685_PWM {
    private enabled = false
    private values: number[] = Array(channelCount).fill(0)
    private i2cBus: I2CBus
    private initialized = false

    constructor(i2cBus: I2CBus) {
        this.i2cBus = i2cBus
    }

    /**
     * Stop all PWM outputs.
     *
     * The PCA9685 will stop creating pulses until `enable()` is called.
     *
     * Connected motor controllers and servos will generally stop movement shortly after this is called.
     */
    disable() {
        if (!this.initialized) {
            throw Error("disable() must be called after initialize() is called")
        }

        // Turn all outputs off
        this.i2cBus.i2cWrite(ALL_LED_BASE + LED_ON_L_OFFSET, 0)
        this.i2cBus.i2cWrite(ALL_LED_BASE + LED_ON_H_OFFSET, 0)
        this.i2cBus.i2cWrite(ALL_LED_BASE + LED_OFF_L_OFFSET, 0)
        this.i2cBus.i2cWrite(ALL_LED_BASE + LED_OFF_H_OFFSET, 0x10) // Full off

        this.enabled = false
    }

    /**
     * Restart all PWM outputs at the pulse widths most recently commanded.
     */
    enable() {
        if (!this.initialized) {
            throw Error("enable() must be called after initialize() is called")
        }

        for (let channel = 0; channel < channelCount; channel++) {
            this.writeChannel(channel)
        }

        this.enabled = true
    }

    /**
     * Set the pulse width output of a given channel.
     *
     * If `enable()`d, PCA9685 output will change immediately.
     * If `disable()`d, value is stored and will be output upon call to `enable()`.
     *
     * @param channel the channel on the PCA9685 to be set. Must be 0 <= channel < channelCount.
     * @param value pulse width to set. 1 is full forward, -1 is full reverse, and 0 is neutral.
     * If value is outside the range -1..1, it will be clamped to said range.
     */
    setPWM(channel: number, value: number) {
        if (!this.initialized) {
            throw Error("setPWM() must be called after initialize() is called")
        }

        if (channel > channelCount || channel < 0) {
            throw new Error("channel must be between 0 and channelCount (" + channelCount + "), was actually " + channel)
        }

        if (value > 1) value = 1
        if (value < -1) value = -1

        this.values[channel] = value

        if (this.enabled) {
            this.writeChannel(channel)
        }
    }

    private writeChannel(channel: number) {
        let channelBase = LED_BASE(channel)
        // Turn on at counter = 0
        this.i2cBus.i2cWrite(channelBase + LED_ON_L_OFFSET, 0)
        this.i2cBus.i2cWrite(channelBase + LED_ON_H_OFFSET, 0)

        // Calculate pulse width based on value
        // value = 1 => 2ms
        // value = -1 => 1ms
        // value = 0 => 1.5ms
        let pulseWidthS = 0.0015 + this.values[channel] * 0.0005
        // 4096 counts = 1/50s
        // 1 count = 1 / (4096 * 50) s
        let pulseWidthCounts = pulseWidthS * 50 * 4096

        this.i2cBus.i2cWrite(channelBase + LED_OFF_L_OFFSET, pulseWidthCounts & 0xff)
        this.i2cBus.i2cWrite(channelBase + LED_OFF_H_OFFSET, (pulseWidthCounts >> 8) & 0x0f)
    }

    initialize() {
        this.initialized = true

        // PRE_SCALE = 25MHz / (4096 * 50Hz) - 1 = 121
        // (pulse each output once every 20ms = 50Hz)
        this.i2cBus.i2cWrite(0xfe, 121)

        // MODE1 = 0x0
        // (take chip out of low power mode)
        this.i2cBus.i2cWrite(0, 0)

        this.disable()
    }
}

export interface I2CBus {
    i2cWrite(register: number, data: number): void
}