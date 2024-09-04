import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

const NewsScreen = ({ route }) => {
  const { news } = route.params;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const openInBrowser = () => {
    const newsUrl = news.link.replace('http://localhost:3001/article?link=/', 'https://tengrinews.kz/');
    Linking.openURL(newsUrl);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(news.link);
        const htmlString = response.data;
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        const contentElement = doc.querySelector('.tn-news-text[data-article-lang="ru"]');

        if (contentElement) {
          const paragraphs = contentElement.querySelectorAll('p');
          if (paragraphs && paragraphs.length > 0) {
            const contentText = Array.from(paragraphs)
              .map((paragraph) => paragraph.textContent.trim())
              .join('\n');

            setContent(contentText);
          } else {
            setContent('Нет контента');
          }
        } else {
          setContent('Нет контента');
        }

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении контента:', error.message);
        setContent('Произошла ошибка при загрузке контента');
        setLoading(false);
      }
    };

    fetchContent();
  }, [news.link]);

  if (loading) {
    return <Text style={styles.newsDetailText}>Загрузка контента...</Text>;
  }

  return (
    <View style={styles.newsDetailContainer}>
      <ScrollView>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.newsDetailText}>{`Время: ${news.time}`}</Text>
        <Text style={styles.newsDetailText}>{`Просмотры: ${news.views}`}</Text>
        <Text style={styles.newsDetailText}>{`Комментарии: ${news.comments}`}</Text>
        <Text style={styles.newsDetailText}>Содержание:</Text>
        <Text style={styles.newsDetailText}>{content}</Text>
        <TouchableOpacity onPress={openInBrowser} style={styles.link}>
          <Text style={styles.linkText}>Открыть в браузере</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const htmlString = response.data;
        console.log(BASE_URL);
        console.log(response.data);
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');

        const extractedNews = [];

        doc.querySelectorAll('.tn-main-news-item').forEach((element) => {
          const title = element.querySelector('.tn-main-news-title')?.textContent?.trim() || 'Нет заголовка';
          const time = element.querySelector('time')?.textContent?.trim() || 'Нет времени';
          const views = element.querySelector('[data-views]')?.dataset.views || '0';
          const comments = element.querySelector('[data-comments]')?.dataset.comments || '0';
          const imageSrc = element.querySelector('img')?.getAttribute('src') || '';
          const link = element.querySelector('a.tn-link')?.getAttribute('href') || '';

          extractedNews.push({
            title,
            time,
            views,
            comments,
            imageSrc,
            link: `${BASE_URL}/article?link=${link}`, // Добавляем базовый URL
          });
        });

        setNews(extractedNews);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
        setError('Произошла ошибка при загрузке данных');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <Text style={styles.newsDetailText}>Загрузка данных...</Text>;
  }

  if (error) {
    return <Text style={styles.newsDetailText}>{error}</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="NewsList"
          component={({ navigation }) => (
            <View style={styles.container}>
              <Text style={styles.title}>Новости</Text>
              <ScrollView>
                {Array.isArray(news) ? (
                  news.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.newsItem}
                      onPress={() => navigation.navigate('NewsDetail', { news: item })}
                    >
                      <Text style={styles.newsTitle}>{item.title}</Text>
                      <Text style={styles.newsDetailText}>{`Время: ${item.time}`}</Text>
                      <Text style={styles.newsDetailText}>{`Просмотры: ${item.views}`}</Text>
                      <Text style={styles.newsDetailText}>{`Комментарии: ${item.comments}`}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.newsDetailText}>Данные не получены</Text>
                )}
              </ScrollView>
            </View>
          )}
          options={{ title: 'Новости' }}
        />
        <Stack.Screen
          name="NewsDetail"
          component={NewsScreen}
          options={{
            title: 'Детали новости',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold', 
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 16,
  },
  newsItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  newsDetailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000000',
  },
  newsDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  newsDetailText: {
    color: '#ffffff',
  },
  stackScreenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stackScreenText: {
    fontSize: 18,
    color: '#ffffff',
  },
  link: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;