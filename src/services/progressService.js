import apiClient from "./apiClient";

const progressService = {
  completeProblem: async (problemId) => {
    const { data } = await apiClient.post(`/progress/problems/${problemId}/complete`);
    return data;
  },
};

export default progressService;
