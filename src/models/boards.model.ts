
interface Board {
  id: number;
  name: string;
  columns: [
    {
      id: number;
      name: string;
      tasks: [
        {
          id: number;
          title: string;
          description: string;
          status: string;
          subtasks: [
            {
              id: number;
              title: string;
              isCompleted: boolean;
            }
          ]
        }
      ]
    }
  ];
}

