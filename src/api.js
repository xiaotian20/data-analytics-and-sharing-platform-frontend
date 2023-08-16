import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
});

export const createAgency = async (username, password1, password2) => {
  try {
    const response = await api.post('/api/register/', {
      username: username,
      password1: password1,
      password2: password2,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Registration failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login/', { username: username, password:password }, { withCredentials: true, headers: {
      'Content-Type': 'application/json',
    }});

    if (response.status === 200) {
      localStorage.setItem('loginId', response.data.loginId); // 存储Agency ID
      return response.data;
    } else {
      throw new Error(`Login failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
export const uploadData = async (data) => {
  const config = {
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  };
  const loginId = localStorage.getItem('loginId'); // 获取Agency ID

  try {
    const response = await axios.post(`/api/agencies/${loginId}/upload_data/`, data, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Upload data failed: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error(`Upload data failed: No response from server`);
    } else {
      throw new Error(`Upload data failed: ${error.message}`);
    }
  }
};



function getCSRFToken() {
  let cookies = decodeURIComponent(document.cookie).split(';');
  let csrfToken = '';

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith('csrftoken=')) {
      csrfToken = cookie.substring('csrftoken='.length, cookie.length);
      break;
    }
  }

  return csrfToken;
}


export async function getDatasets() {
  try {
    const response = await axios.get('/api/data'); 
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fuseData = async (dataId, otherDataId, fuseType, fuseName, fusePublic, fuseAgencies, fuseOn) => {
  try {
    const userId = localStorage.getItem('loginId');
    const response = await axios.post(`/api/data/${dataId}/fuse_data/`, 
      { userId, otherDataId, type: fuseType, description: fuseName, public: fusePublic, agencies: fuseAgencies, on: fuseOn }, 
      { headers: { 
        'X-CSRFToken': getCSRFToken(),
      } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Fuse data failed');
  }
};



export const regression = async (dataId, mlModel, inputFeatures, outputFeature) => {
  try {
    const userId = localStorage.getItem('loginId');
    const response = await axios.post(`/api/data/${dataId}/regression/`, {
      userId,
      model: mlModel,
      input_features: inputFeatures,
      output_feature: outputFeature,
    }, 
    { headers: { 'X-CSRFToken': getCSRFToken() } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Run regression failed');
  }
};

export const classification = async (dataId, mlModel, inputFeatures, outputFeature) => {
  try {
    const userId = localStorage.getItem('loginId');

    const response = await axios.post(`/api/data/${dataId}/classification/`, {
      userId,
      model: mlModel,
      input_features: inputFeatures,
      output_feature: outputFeature,
    }, 
    { headers: { 'X-CSRFToken': getCSRFToken() } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Run classification failed');
  }
};

export const clustering = async (dataId, mlModel, inputFeatures) => {
  try {
    const userId = localStorage.getItem('loginId');

    const response = await axios.post(`/api/data/${dataId}/clustering/`, {
      userId,
      model: mlModel,
      input_features: inputFeatures,
    }, 
    { headers: { 'X-CSRFToken': getCSRFToken() } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Run clustering failed');
  }
};


export const approveResult = async (dataId, approvalStatus) => {
  try {
    const response = await axios.post(`/api/approve_result/${dataId}/`, { approval_status: approvalStatus });
    return response.data;
  } catch (error) {
    throw new Error('Approve result failed');
  }
};


export default api;