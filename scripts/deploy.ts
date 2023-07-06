import { ethers, run } from "hardhat";

async function main() {
  await run("compile");

  const [deployer] = await ethers.getSigners();

  // SecretRegistryのデプロイ
  const secretRegistry = await ethers.deployContract("SecretRegistry");
  await secretRegistry.waitForDeployment();

  const secretRegistryAddress = await secretRegistry.getAddress();
  console.log("SecretRegistry deployed to:", secretRegistryAddress);

  // TokenNetworkRegistryのデプロイ
  // _settle_timeoutや_max_token_networksなど、TokenNetworkRegistryのパラメータを適切に設定してください。
  const _settle_timeout = 500;
  const _max_token_networks = 50;

  const tokenNetworkRegistry = await ethers.deployContract(
    "TokenNetworkRegistry",
    [secretRegistry.getAddress(), _settle_timeout, _max_token_networks],
    deployer
  );
  await tokenNetworkRegistry.waitForDeployment();
  const tokenNetworkRegistryAddress = await tokenNetworkRegistry.getAddress();

  console.log("TokenNetworkRegistry deployed to:", tokenNetworkRegistryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
