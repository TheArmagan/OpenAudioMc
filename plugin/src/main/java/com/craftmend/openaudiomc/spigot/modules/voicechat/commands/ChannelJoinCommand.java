package com.craftmend.openaudiomc.spigot.modules.voicechat.commands;

import com.craftmend.openaudiomc.api.clients.Client;
import com.craftmend.openaudiomc.generic.client.objects.ClientConnection;
import com.craftmend.openaudiomc.generic.commands.interfaces.SubCommand;
import com.craftmend.openaudiomc.generic.commands.objects.CommandError;
import com.craftmend.openaudiomc.generic.platform.Platform;
import com.craftmend.openaudiomc.generic.storage.enums.StorageKey;
import com.craftmend.openaudiomc.generic.user.User;
import com.craftmend.openaudiomc.spigot.modules.voicechat.VoiceChannelService;
import com.craftmend.openaudiomc.spigot.modules.voicechat.channels.Channel;
import lombok.SneakyThrows;

public class ChannelJoinCommand extends SubCommand {

    public ChannelJoinCommand() {
        super("join");
        this.trimArguments = true;
    }

    @Override
    @SneakyThrows
    public void onExecute(User sender, String[] args) {
        if (args.length != 1) {
            throw new CommandError("Please specify a name for the channel");
        }

        Client client = (Client) sender.findClient().get();
        if (!client.hasVoicechatEnabled()) {
            throw new CommandError(StorageKey.MESSAGE_VC_NOT_CONNECTED.getString());
        }

        ClientConnection clientConnection = (ClientConnection) client;
        Channel channel = clientConnection.getRtcSessionManager().getCurrentChannel();

        if (channel != null) {
            throw new CommandError(StorageKey.MESSAGE_VOICE_CHANNEL_ALREADY_MEMBER.getString());
        }

        String channelName = args[0].toLowerCase();
        Channel targetChannel = getService(VoiceChannelService.class).getChannel(channelName);
        if (targetChannel == null) {
            throw new CommandError(StorageKey.MESSAGE_VOICE_CHANNEL_NOT_FOUND.getString());
        }

        targetChannel.addMember(sender);
        sender.sendMessage(Platform.translateColors(
                StorageKey.MESSAGE_VOICE_CHANNEL_JOINED.getString()
                        .replace("{channel}", channelName)
        ));
    }
}