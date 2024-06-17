import Home from '@/components/icons/home';

export const menuOptions = [
    { name: 'Dashboard', Component: Home, href: '/dashboard' },
  ]
  export const EditorCanvasDefaultCardTypes = {
    Router: {
      description: 'This IoT device is a Router. It serves as the central hub for network communication, routing data packets between devices and managing traffic within the network. Routers typically provide connectivity between different networks and direct traffic efficiently to ensure optimal performance.',
      type: 'Action',
    },
    Device: {
      description: 'This IoT device is a default Device. It represents any generic network-connected device, such as sensors, smart appliances, or other connected gadgets. These devices interact with the network to send and receive data, enabling various IoT functionalities.',
      type: 'Action',
    },
  };
  