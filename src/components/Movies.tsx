'use client';

import { Button, Card, Grid, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

interface Movie {
  id: string;
  title: string;
  director: string;
  year: string;
  genre: string;
}

export function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch movies',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      director: '',
      year: '',
      genre: '',
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must be at least 2 characters' : null),
      year: (value) => (/^\d{4}$/.test(value) ? null : 'Year must be a 4-digit number'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      form.reset();
      fetchMovies();
      notifications.show({
        title: 'Success',
        message: 'Movie added to collection',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add movie',
        color: 'red',
      });
    }
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Title"
              placeholder="Enter movie title"
              {...form.getInputProps('title')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Director"
              placeholder="Enter director name"
              {...form.getInputProps('director')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Year"
              placeholder="Enter release year"
              {...form.getInputProps('year')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Genre"
              placeholder="Enter genre"
              {...form.getInputProps('genre')}
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Add Movie</Button>
        </Group>
      </form>

      <Grid>
        {movies.map((movie) => (
          <Grid.Col key={movie.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg">
              <Text fw={500} size="lg" mb="xs">
                {movie.title} ({movie.year})
              </Text>
              <Text size="sm" c="dimmed">
                Director: {movie.director}
              </Text>
              <Text size="sm" c="dimmed">
                Genre: {movie.genre}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
