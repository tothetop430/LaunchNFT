export const convertResponseToJson = async (response: Response): Promise<any> => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };