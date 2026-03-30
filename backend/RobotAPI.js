import fetch from "node-fetch";

class RobotAPI {
  constructor() {
    if (!RobotAPI.instance) {
      this.apiEndpoint = "http://localhost:5000";
      this.token = "your-api-token";
      RobotAPI.instance = this;
    }
    return RobotAPI.instance;
  }

  async handleResponse(response, endpointName) {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `${endpointName} failed with status ${response.status}: ${text}`,
      );
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(
        `${endpointName} did not return valid JSON. Raw response: ${text}`,
      );
    }
  }

  async getStatus() {
    const response = await fetch(`${this.apiEndpoint}/api/status`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return this.handleResponse(response, "getStatus");
  }

  async moveRobot(x, y) {
    const response = await fetch(`${this.apiEndpoint}/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ x, y }),
    });

    return this.handleResponse(response, "moveRobot");
  }

  async resetRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return this.handleResponse(response, "resetRobot");
  }

  async mapRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/map`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return this.handleResponse(response, "mapRobot");
  }

  async sensorRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/sensor`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return this.handleResponse(response, "sensorRobot");
  }
}

const instance = new RobotAPI();
Object.freeze(instance);

export default instance;
