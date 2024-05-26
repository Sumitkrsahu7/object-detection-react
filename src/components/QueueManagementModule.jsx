import React, { useEffect, useState } from 'react';

const QueueManagementModule = ({ detectedObjects }) => {
  const [objectQueue, setObjectQueue] = useState([]);

  useEffect(() => {
    // Update the queue when new detected objects are received
    if (detectedObjects.length > 0) {
      setObjectQueue(prevQueue => [...prevQueue, ...detectedObjects]);
    }
  }, [detectedObjects]);

  useEffect(() => {
    // Process the objects in the queue when it changes
    processQueue();
  }, [objectQueue]);

  const processQueue = () => {
    if (objectQueue.length > 0) {
      console.log('Processing Queue...');
      console.log('Objects in Queue:', objectQueue);

      // Sort objects based on priority
      const sortedQueue = objectQueue.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      
      // Process each object one by one
      sortedQueue.forEach((object, index) => {
        console.log(`Processing Object ${index + 1}:`, object);
        try {
          // Simulate processing time with setTimeout
          setTimeout(() => {
            console.log(`Object ${index + 1} processed successfully.`);
            // Implement your processing logic here
          }, 1000);
        } catch (error) {
          console.error(`Error processing Object ${index + 1}:`, error.message);
        }
      });

      // Clear the queue after processing
      setObjectQueue([]);
    }
  };

  const filterObjects = (type) => {
    // Filter objects in the queue based on type
    const filteredObjects = objectQueue.filter(object => object.type === type);
    console.log(`Filtered Objects (Type: ${type}):`, filteredObjects);
  };

  return (
    <div>
      <h2>Queue Management Module</h2>
      <button onClick={() => filterObjects('person')}>Filter Persons</button>
      <button onClick={() => filterObjects('car')}>Filter Cars</button>
    </div>
  );
};

export default QueueManagementModule;
