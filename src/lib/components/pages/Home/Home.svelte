<script lang="ts">
  import styles from './Home.module.scss';
  import { Text, List, PropTable } from '$lib';

  const characters = [
    { content: 'Harry Potter', link: '/harry-potter', starred: true, },
    { content: 'Hermione Granger', link: '/hermione-granger' },
    { content: 'Ron Weasley', link: '/ron-weasley' },
    { content: 'Draco Malfoy', link: '/draco-malfoy', selected: true },
    { content: 'Luna Lovegood', link: '/luna-lovegood' }
  ];

  const actions = [
    { content: 'Vitals', link: '/vitals/' },
    { content: 'Relationships', link: '/relationships' },
  ];

  const propTableItems = [
    { name: 'Name', value: 'Albus Dumbledore' },
    { name: 'Born', value: '1881' },
    { name: 'Died', value: '30 June 1997' }
  ];
</script>

<div class={styles.container}>
  <div class={styles.column}>
    <Text weight="md">Characters</Text>
  </div>
  <div class={styles.column}>
    <List items={characters} />
  </div>
  <div class={styles.column}>
    <List items={actions} />
  </div>
  <div class={styles.doubleColumn}>
    <PropTable items={propTableItems} />
  </div>
</div>
