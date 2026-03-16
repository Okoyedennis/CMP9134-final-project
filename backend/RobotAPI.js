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

  async getStatus() {
    const response = await fetch(`${this.apiEndpoint}/api/status`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
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
    return await response.json();
  }

  async resetRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/reset`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}` },
      // body: "",x
    });

    return await response.json();
  }

  async mapRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/map`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async sensorRobot() {
    const response = await fetch(`${this.apiEndpoint}/api/sensor`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }
}

const instance = new RobotAPI();
Object.freeze(instance);

export default instance;
