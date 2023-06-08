export REACT_APP_BASE_URL=https://react-drawer-count.onrender.com/api  
export REACT_APP_NODE_ENV=prod

npm run build
cp build/index.html build/200.html
surge build react-drawer-count.surge.sh