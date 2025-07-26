const Notification = ({ message }) => {
  if (message === null) return null;

  if (message.includes("error")) {
    return <div className="error">{message.substring(5)}</div>;
  }

  return <div className="message">{message}</div>; 
};

export default Notification;
