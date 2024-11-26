'use client';

import { Button, Card, Grid, Group, Text, TextInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

interface Game {
  id: string;
  title: string;
  platform: string;
  publisher: string;
  year: string;
  genre: string;
}

const platforms = [
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'PC',
  'Other',
];

export function Games() {
  const [games, setGames] = useState<Game[]>([]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch games',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      platform: '',
      publisher: '',
      year: '',
      genre: '',
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must be at least 2 characters' : null),
      platform: (value) => (!value ? 'Platform is required' : null),
      year: (value) => (/^\d{4}$/.test(value) ? null : 'Year must be a 4-digit number'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      form.reset();
      fetchGames();
      notifications.show({
        title: 'Success',
        message: 'Game added to collection',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add game',
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
              placeholder="Enter game title"
              {...form.getInputProps('title')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Platform"
              placeholder="Select platform"
              data={platforms}
              {...form.getInputProps('platform')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Publisher"
              placeholder="Enter publisher"
              {...form.getInputProps('publisher')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Year"
              placeholder="Enter release year"
              {...form.getInputProps('year')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Genre"
              placeholder="Enter genre"
              {...form.getInputProps('genre')}
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Add Game</Button>
        </Group>
      </form>

      <Grid>
        {games.map((game) => (
          <Grid.Col key={game.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg">
              <Text fw={500} size="lg" mb="xs">
                {game.title} ({game.year})
              </Text>
              <Text size="sm" c="dimmed">
                Platform: {game.platform}
              </Text>
              <Text size="sm" c="dimmed">
                Publisher: {game.publisher}
              </Text>
              <Text size="sm" c="dimmed">
                Genre: {game.genre}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
