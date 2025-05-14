import React, { useContext, useEffect, useState } from 'react';
import './NextTasks.css';
import { Context } from '../../../context/AuthContext';
import axios from 'axios';

const tasks = Array.from({ length: 13 }, () => ({
  orderId: '#123456',
  company: 'El Arosa Tea',
  task: 'Print',
}));

const NextTasksPanel = ({ selectedMonth }) => {
  const { baseUrl, token } = useContext(Context);
  const [tasks, setTasks] = useState([])
  const getNextTasks = async () => {
    try {
      const url = selectedMonth
        ? `${baseUrl}/dashboard/statistics/${selectedMonth}`
        : `${baseUrl}/dashboard/statistics`; // أو المسار الافتراضي عند عدم وجود شهر

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTasks(res?.data?.nextTasks);
      console.log(res?.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNextTasks()
  }, [])
  return (
    <div className="next-tasks-panel">
      <h2 className="next-tasks-title">Next Tasks</h2>
      <table className="next-tasks-table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Type</th>
            <th>Task</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task, index) => (
            <tr key={index}>
              <td>{task.id}</td>
              <td>{task.type}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NextTasksPanel;
