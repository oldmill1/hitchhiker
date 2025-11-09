<script lang="ts">
  import styles from './Home.module.scss';
  import { Text, List } from '$lib';

  const characters = [
    { content: 'Harry Potter', link: '/harry-potter', starred: true, },
    { content: 'Hermione Granger', link: '/hermione-granger' },
    { content: 'Ron Weasley', link: '/ron-weasley' },
    { content: 'Draco Malfoy', link: '/draco-malfoy', selected: true },
    { content: 'Luna Lovegood', link: '/luna-lovegood' }
  ];
</script>

<div class={styles.container}>
  <div class={styles.column}>
    <Text>Characters</Text>
  </div>
  <div class={styles.column}>
    <List items={characters} />
  </div>
  <div class={styles.column}>
    <Text>3</Text>
  </div>
  <div class={styles.column}>
    <Text>4</Text>
  </div>
  <div class={styles.column}>
    <Text>5</Text>
  </div>
</div>
