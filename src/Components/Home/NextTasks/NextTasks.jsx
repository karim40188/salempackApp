import React from 'react';
import './NextTasks.css';

const tasks = Array.from({ length: 13 }, () => ({
  orderId: '#123456',
  company: 'El Arosa Tea',
  task: 'Print',
}));

const NextTasksPanel = () => {
  return (
    <div className="next-tasks-panel">
      <h2 className="next-tasks-title">Next Tasks</h2>
      <table className="next-tasks-table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Company</th>
            <th>Task</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.orderId}</td>
              <td>{task.company}</td>
              <td>{task.task}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NextTasksPanel;
