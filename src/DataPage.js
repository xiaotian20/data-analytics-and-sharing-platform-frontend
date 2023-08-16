import { getDatasets, fuseData, regression, classification, clustering, uploadData } from './api';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


function DataPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dataId, setDataId] = useState('');
  const [otherDataId, setOtherDataId] = useState('');
  const [fuseType, setFuseType] = useState('');
  const [fuseOn, setFuseOn] = useState('');
  const [fuseName, setFuseName] = useState('');
  const [fusePublic, setFusePublic] = useState(true);
  const [fuseAgencies, setFuseAgencies] = useState([]);
  const [inputFeatures, setInputFeatures] = useState([]);
  const [outputFeature, setOutputFeature] = useState('');
  const [mlModel, setMlModel] = useState('');
  const [publicFlag, setPublicFlag] = useState(false);
  const [privacyCols, setPrivacyCols] = useState([]);
  const [epsilon, setEpsilon] = useState(1.0);
  const [agencies, setAgencies] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [fuseResult, setFuseResult] = useState(null);
  const [regressionResult, setRegressionResult] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [clusteringResult, setClusteringResult] = useState(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const data = await getDatasets();
        setDatasets(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatasets();
  }, []);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('public', publicFlag.toString());
    formData.append('privacy_cols', JSON.stringify(privacyCols));
    formData.append('epsilon', epsilon.toString());
    formData.append('agencies', JSON.stringify(agencies));
    
    try {
      const response = await uploadData(formData);
      console.log(response);
      setUploadResult('Upload successful');
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleFuse = async () => {
    const data = await fuseData(
      dataId, 
      otherDataId, 
      fuseType, 
      fuseName, 
      fusePublic, 
      fuseAgencies, 
      fuseOn
    );
    console.log(data);
    setFuseResult(data);
  };


  const handleRunRegression = async () => {
    const data = await regression(dataId, mlModel, inputFeatures, outputFeature);
    console.log(data);
    setRegressionResult(data);
  };

  const handleRunClassification = async () => {
    const data = await classification(dataId, mlModel, inputFeatures, outputFeature );
    console.log(data);
    setClassificationResult(data);
  };

  const handleRunClustering = async () => {
    const data = await clustering(dataId, mlModel, inputFeatures);
    console.log(data);
    setClusteringResult(data);
  };

    
  

  return (
    <div>
      <h1>Data Platform</h1>
      {/* Upload Data */}
      <div>
        <h2>Upload Data</h2>
        <input type="file" onChange={handleFileChange} />
        <label>Public</label>
        <input type="checkbox" onChange={(e) => setPublicFlag(e.target.checked)} />
        <input
          type="text"
          placeholder="Privacy Columns (comma-separated)"
          onChange={(e) => setPrivacyCols(e.target.value.split(','))}
        />                
        <input type="text" placeholder="Epsilon" onChange={(e) => setEpsilon(e.target.value)} />
        <input
          type="text"
          placeholder="Available Agencies (comma-separated)"
          onChange={(e) => setAgencies(e.target.value.split(','))}  
        />
        <button onClick={handleUpload}>Upload</button>
        {uploadResult && <p>Upload Result: {uploadResult}</p>}
      </div>
      {/* Fuse Data */}
      <div>
        <h2>Fuse Data</h2>
        <select onChange={(e) => setDataId(e.target.value)}>
          <option value="">Select Data Set</option>
          {datasets.map(dataset => (
            <option value={dataset.id} key={dataset.id}>{dataset.data}</option>
          ))}
        </select>
        <select onChange={(e) => setOtherDataId(e.target.value)}>
          <option value="">Select Other Data Set</option>
          {datasets.map(dataset => (
            <option value={dataset.id} key={dataset.id}>{dataset.data}</option>
          ))}
        </select>
        <select onChange={(e) => setFuseType(e.target.value)}>
          <option value="">Select Fuse Type</option>
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
        <input
          type="text"
          value={fuseOn}
          onChange={(e) => setFuseOn(e.target.value)}
          placeholder="Column to fuse on"
        />
        <input
          type="text"
          value={fuseName}
          onChange={(e) => setFuseName(e.target.value)}
          placeholder="Fused data name"
        />

        <label>
          <input
            type="checkbox"
            checked={fusePublic}
            onChange={() => setFusePublic(!fusePublic)}
          />
          public
        </label>

        {/* Here I assume that you have a getAgencies function that fetches all agencies */}
        {/* The agency object should have at least an id and a name */}
        <input
          type="text"
          placeholder="Available Agencies (comma-separated)"
          onChange={(e) => setFuseAgencies(e.target.value.split(','))}  
        />
        
        <button onClick={handleFuse}>Fuse Data</button>
        {fuseResult && <p>Fuse Result: {JSON.stringify(fuseResult)}</p>}
      </div>

      {/* Run Regression */}
      <div>
        <h2>Run Regression</h2>
        <select onChange={(e) => setDataId(e.target.value)}>
          <option value="">Select Data Set</option>
          {datasets.map(dataset => (
            <option value={dataset.id} key={dataset.id}>{dataset.data}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Input Features (comma-separated)"
          onChange={(e) => setInputFeatures(e.target.value.split(','))}
        />
        <input type="text" placeholder="Output Feature" onChange={(e) => setOutputFeature(e.target.value)} />
        <select onChange={(e) => setMlModel(e.target.value)}>
          <option value="">Select ML Model</option>
          <option value="linear_regression">Linear Regression</option>
          <option value="decision_tree">Decision Tree</option>
          <option value="random_forest">Random Forest</option>
          <option value="svr">SVR</option>
          <option value="k_neighbors">K Neighbors</option>
          <option value="mlp">MLP</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleRunRegression}>Run Regression</button>
        {regressionResult && <p>Regression Result: {JSON.stringify(regressionResult)}</p>}
      </div>

      {/* Run Classification */}
      <div>
        <h2>Run Classification</h2>
        <select onChange={(e) => setDataId(e.target.value)}>
          <option value="">Select Data Set</option>
          {datasets.map(dataset => (
            <option value={dataset.id} key={dataset.id}>{dataset.data}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Input Features (comma-separated)"
          onChange={(e) => setInputFeatures(e.target.value.split(','))}
        />
        <input type="text" placeholder="Output Feature" onChange={(e) => setOutputFeature(e.target.value)} />
        <select onChange={(e) => setMlModel(e.target.value)}>
          <option value="">Select ML Model</option>
          <option value="decision_tree">Decision Tree</option>
          <option value="random_forest">Random Forest</option>
          <option value="k_neighbors">K Neighbors</option>
          <option value="mlp">MLP</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleRunClassification}>Run Classification</button>
        {classificationResult && <p>Classification Result: {JSON.stringify(classificationResult)}</p>}
      </div>

      {/* Run Clustering */}
      <div>
        <h2>Run Clustering</h2>
        <select onChange={(e) => setDataId(e.target.value)}>
          <option value="">Select Data Set</option>
          {datasets.map(dataset => (
            <option value={dataset.id} key={dataset.id}>{dataset.data}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Input Features (comma-separated)"
          onChange={(e) => setInputFeatures(e.target.value.split(','))}
        />
        <select onChange={(e) => setMlModel(e.target.value)}>
          <option value="">Select ML Model</option>
          <option value="k_means">K Means</option>
          <option value="dbscan">DBSCAN</option>
          <option value="agglomerative">Agglomerative</option>
          <option value="birch">Birch</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleRunClustering}>Run Clustering</button>
        {clusteringResult && <p>Clustering Result: {JSON.stringify(clusteringResult)}</p>}
      </div>
    </div>
  );
}

export default DataPage;
