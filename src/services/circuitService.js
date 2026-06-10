/**
 * circuitService.js
 *
 * Handles saving and loading circuit projects to/from MongoDB via the backend.
 * Falls back gracefully when the user is unauthenticated or offline.
 */

import apiClient from "./apiClient";

const circuitService = {
  /**
   * Fetch all saved circuits for the current user.
   * Returns [] on failure (unauthenticated / offline).
   */
  list: async () => {
    try {
      const { data } = await apiClient.get("/circuits");
      return data.circuits || [];
    } catch {
      return [];
    }
  },

  /**
   * Save (create or overwrite) a circuit by name.
   * @param {string} name  - Project name
   * @param {object} data  - { gates, wires, gateIdCounter, wireIdCounter, inputCounter, outputCounter }
   * @returns {{ success: boolean, circuit?: object, message?: string }}
   */
  save: async (name, data) => {
    try {
      const { data: res } = await apiClient.post("/circuits", { name, ...data });
      return { success: true, circuit: res.circuit };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Could not save to server.",
      };
    }
  },

  /**
   * Delete a circuit by its MongoDB _id.
   * @param {string} id
   * @returns {{ success: boolean, message?: string }}
   */
  delete: async (id) => {
    try {
      await apiClient.delete(`/circuits/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Could not delete from server.",
      };
    }
  },

  /**
   * Fetch a single circuit by its MongoDB _id.
   * @param {string} id
   * @returns {{ success: boolean, circuit?: object, message?: string }}
   */
  get: async (id) => {
    try {
      const { data } = await apiClient.get(`/circuits/${id}`);
      return { success: true, circuit: data.circuit };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Could not load circuit.",
      };
    }
  },
};

export default circuitService;
