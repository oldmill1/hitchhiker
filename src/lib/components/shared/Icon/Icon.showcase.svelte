<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Icon from './Icon.svelte';

  const { Story } = defineMeta({
    title: 'Shared/Icon/Showcase',
    component: Icon,
  });
</script>

<!-- Travel icons showcase -->
<Story name="Travel Icons" />


<div class="icon-showcase">
  <h2>Travel Icons from Twemoji</h2>
  <div class="icon-grid">
    <div class="icon-item">
      <Icon icon="airplane" size="32px" />
      <span>Airplane</span>
    </div>
    <div class="icon-item">
      <Icon icon="hotel" size="32px" />
      <span>Hotel</span>
    </div>
    <div class="icon-item">
      <Icon icon="car" size="32px" />
      <span>Car</span>
    </div>
    <div class="icon-item">
      <Icon icon="train" size="32px" />
      <span>Train</span>
    </div>
    <div class="icon-item">
      <Icon icon="luggage" size="32px" />
      <span>Luggage</span>
    </div>
    <div class="icon-item">
      <Icon icon="world-map" size="32px" />
      <span>World Map</span>
    </div>
    <div class="icon-item">
      <Icon icon="camera" size="32px" />
      <span>Camera</span>
    </div>
    <div class="icon-item">
      <Icon icon="passport-control" size="32px" />
      <span>Passport</span>
    </div>
  </div>
</div>

<style>
  .icon-showcase {
    padding: 20px;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #f9f9f9;
  }

  .icon-item span {
    font-size: 12px;
    color: #666;
    text-align: center;
  }
</style>
