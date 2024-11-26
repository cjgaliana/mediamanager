'use client';

import { Button, Card, Grid, Group, Text, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  genre: string;
  isbn: string;
  description: string;
}

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch books',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      year: '',
      genre: '',
      isbn: '',
      description: '',
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must be at least 2 characters' : null),
      author: (value) => (value.length < 2 ? 'Author must be at least 2 characters' : null),
      year: (value) => (/^\d{4}$/.test(value) ? null : 'Year must be a 4-digit number'),
      isbn: (value) => (value && !/^[\d-]{10,17}$/.test(value) ? 'Invalid ISBN format' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      form.reset();
      fetchBooks();
      notifications.show({
        title: 'Success',
        message: 'Book added to collection',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add book',
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
              placeholder="Enter book title"
              {...form.getInputProps('title')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              label="Author"
              placeholder="Enter author name"
              {...form.getInputProps('author')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="Year"
              placeholder="Enter publication year"
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
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <TextInput
              label="ISBN"
              placeholder="Enter ISBN"
              {...form.getInputProps('isbn')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Description"
              placeholder="Enter book description"
              {...form.getInputProps('description')}
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Add Book</Button>
        </Group>
      </form>

      <Grid>
        {books.map((book) => (
          <Grid.Col key={book.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg">
              <Text fw={500} size="lg" mb="xs">
                {book.title} ({book.year})
              </Text>
              <Text size="sm" c="dimmed">
                Author: {book.author}
              </Text>
              <Text size="sm" c="dimmed">
                Genre: {book.genre}
              </Text>
              {book.isbn && (
                <Text size="sm" c="dimmed">
                  ISBN: {book.isbn}
                </Text>
              )}
              {book.description && (
                <Text size="sm" mt="sm">
                  {book.description}
                </Text>
              )}
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
