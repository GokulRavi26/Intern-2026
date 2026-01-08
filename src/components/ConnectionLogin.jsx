import { useState } from 'react';
import './ConnectionLogin.css';

export default function ConnectionLogin({ onConnect }) {
  const [formData, setFormData] = useState({
    host: localStorage.getItem('rabbitmq_host') || '',
    port: localStorage.getItem('rabbitmq_port') || '15675',
    username: localStorage.getItem('rabbitmq_username') || '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.host.trim()) {
      newErrors.host = 'IP Address is required';
    }
    
    if (!formData.port.trim()) {
      newErrors.port = 'Port is required';
    } else if (isNaN(formData.port) || formData.port < 1 || formData.port > 65535) {
      newErrors.port = 'Invalid port number';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsConnecting(true);
    
    try {
      await onConnect(formData);
      
      // Save credentials (except password) to localStorage
      localStorage.setItem('rabbitmq_host', formData.host);
      localStorage.setItem('rabbitmq_port', formData.port);
      localStorage.setItem('rabbitmq_username', formData.username);
      
    } catch (error) {
      setErrors({ submit: error.message || 'Connection failed' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="connection-login-container">
      <div className="connection-login-card">
        <div className="login-header">
          <h1>Factory Monitor</h1>
          <p>Connect to RabbitMQ MQTT Broker</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="host">IP Address / Host</label>
            <input
              type="text"
              id="host"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="e.g., 0.0.0.0"
              className={errors.host ? 'error' : ''}
              disabled={isConnecting}
            />
            {errors.host && <span className="error-message">{errors.host}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="port">WebSocket Port</label>
            <input
              type="text"
              id="port"
              name="port"
              value={formData.port}
              onChange={handleChange}
              placeholder="15675"
              className={errors.port ? 'error' : ''}
              disabled={isConnecting}
            />
            {errors.port && <span className="error-message">{errors.port}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="factory"
              className={errors.username ? 'error' : ''}
              disabled={isConnecting}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
              disabled={isConnecting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="submit-error">
               {errors.submit}
            </div>
          )}

          <button 
            type="submit" 
            className="connect-button"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                 Connect
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Make sure RabbitMQ MQTT plugin is enabled and WebSocket is accessible</p>
        </div>
      </div>
    </div>
  );
}
