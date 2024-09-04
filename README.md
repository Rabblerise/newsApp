# Expo News App - Mobile News Reader

## Description

**Expo News App** is a mobile application built with React Native and Expo for fetching and displaying news articles. The app uses `axios` for HTTP requests and provides users with the ability to read news content directly within the app or open the articles in a browser. It demonstrates key features such as navigation using React Navigation, state management with hooks, and efficient data fetching with error handling.

## Features
- **News Fetching:** Retrieves and parses news articles from a remote source using `axios` and displays them in a user-friendly format.
- **Navigation:** Implements stack-based navigation using React Navigation, allowing users to browse through news articles.
- **Responsive UI:** The app provides a responsive design with custom styles, suitable for different screen sizes.
- **Error Handling:** Includes comprehensive error handling for failed network requests, ensuring a smooth user experience.
- **External Linking:** Users can open the full news articles in an external browser directly from the app.
- **Custom Styling:** The app is styled with React Native's `StyleSheet` for a clean and modern look.

## Technologies Used
- React Native
- Expo
- Axios
- React Navigation
- Express (for backend server)

## Project Structure
- **App.js:** Main entry point of the application, containing the navigation stack and fetching logic.
- **NewsScreen.js:** Displays detailed news content, including the title, publication time, views, comments, and the article body.
- **Express Server:** A simple Node.js server using Express to fetch data from a remote news source and handle CORS.

## Screenshots
### News List
![изображение](https://github.com/user-attachments/assets/4133ddda-b820-4d99-b7e5-ac7e2b3dddd8)

### News Detail
![изображение](https://github.com/user-attachments/assets/e5c59e48-2918-4815-8022-dcc93cc41704)

### Browser Link
![изображение](https://github.com/user-attachments/assets/031d21c3-3a63-4a7f-9696-f7bdf86f0198)


## Getting Started
1. Clone the repository.
2. Install the dependencies: `yarn install`
3. Start the Expo project: `yarn start`
4. Run the app on a physical device or emulator via Expo Go.

## Server Setup
1. Navigate to the `server` directory.
2. Install the server dependencies: `npm install`
3. Start the server: `node server.js`
4. The server will run on `http://localhost:3001`.

## Example Usage
```javascript
// Fetching news data in the NewsScreen component
useEffect(() => {
  const fetchNews = async () => {
    try {
      const response = await axios.get(BASE_URL);
      // Process and set news data
    } catch (error) {
      console.error('Error fetching news:', error.message);
    }
  };

  fetchNews();
}, []);
```

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## Dependencies
- react-native
- expo
- axios
- react-navigation
- express
- cors
