import { Option } from 'commander'
import SauceCommand from './sauce-command'

const sauceTunnelId = (cmd) => {
  // Saucelabs tunnel id. Please set it via environmental variable SAUCE_TUNNEL_ID or pass it with the --sauce-tunnel-id option
  // .requiredOption(
  //   '-t, --sauce-tunnel-id [id]',
  //   'sauce labs tunnel id, must be supplied or SAUCE_TUNNEL_ID defined',
  //   process.env.SAUCE_TUNNEL_ID)
  return cmd.addOption(
    new Option(
      '-t, --sauce-tunnel-id <id>',
      'sauce labs tunnel id, must be supplied or SAUCE_TUNNEL_ID defined',
    ).default(
      process.env.SAUCE_TUNNEL_ID, 'SAUCE_TUNNEL_ID'
    ).makeOptionMandatory())
}

export default class SauceWithTunnelCommand extends SauceCommand {
  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    const cmd = super.command(nameAndArgs, actionOptsOrExecDesc, execOpts)

    sauceTunnelId(cmd)
    return cmd
  }
}
